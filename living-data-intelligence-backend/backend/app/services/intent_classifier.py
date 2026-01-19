"""
Intent Classifier Service
Classifies user voice commands into actionable intents using LLM + rule-based hybrid approach.
"""
import os
import re
from typing import Dict, List, Optional, Any, Tuple
import json

# Import LLM clients
try:
    from groq import AsyncGroq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

from app.services.command_registry import get_command_registry


class IntentClassifier:
    """
    Hybrid intent classifier using both rule-based matching and LLM inference.
    Falls back gracefully: Rule-based → Groq → Gemini → Default
    """
    
    def __init__(self):
        """Initialize the intent classifier."""
        self.command_registry = get_command_registry()
        self.groq_client = None
        self.gemini_model = None
        
        # Initialize LLM clients
        self._init_groq()
        self._init_gemini()
        
        # Classification history for context
        self.history: List[Dict[str, Any]] = []
        self.max_history = 5
    
    def _init_groq(self) -> None:
        """Initialize Groq client if API key is available."""
        if not GROQ_AVAILABLE:
            print("[WARNING] Groq library not installed")
            return
            
        api_key = os.getenv('GROQ_API_KEY')
        if api_key:
            try:
                self.groq_client = AsyncGroq(api_key=api_key)
                print("[SUCCESS] Groq LLM (Async) initialized for intent classification")
            except Exception as e:
                print(f"[ERROR] Groq initialization failed: {e}")
        else:
            print("[ERROR] GROQ_API_KEY not found in environment")
    
    def _init_gemini(self) -> None:
        """Initialize Gemini client if API key is available."""
        if not GEMINI_AVAILABLE:
            print("[WARNING] Gemini library not installed")
            return
            
        api_key = os.getenv('GOOGLE_API_KEY')
        if api_key:
            try:
                genai.configure(api_key=api_key)
                self.gemini_model = genai.GenerativeModel('gemini-pro')
                print("[SUCCESS] Gemini LLM initialized for intent classification")
            except Exception as e:
                print(f"[WARNING] Gemini initialization failed: {e}")
        else:
            print("[WARNING] GOOGLE_API_KEY not found in environment")
    
    async def classify(self, text: str, context: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Classify user text into an intent with extracted parameters.
        
        Args:
            text: The user's voice command text
            context: Optional list of recent commands for context
            
        Returns:
            Classification result with intent, parameters, confidence, and method
        """
        # Step 1: Try rule-based matching first
        rule_result = self._classify_rule_based(text)
        if rule_result:
            return {
                **rule_result,
                'confidence': 1.0,
                'method': 'rule_based',
                'alternatives': []
            }
        
        # Step 2: Try LLM classification (Groq or Gemini)
        llm_result = await self._classify_llm(text, context)
        if llm_result:
            return llm_result
        
        # Step 3: Fallback to fuzzy matching
        fuzzy_result = self._classify_fuzzy(text)
        if fuzzy_result:
            return fuzzy_result
        
        # Step 4: Unknown / Failed classification
        return {
            'intent': 'unknown',
            'action': None,
            'parameters': {},
            'confidence': 0.0,
            'method': 'failed',
            'error': 'Could not classify command',
            'suggestions': self._get_suggestions(text)
        }
    
    def _classify_rule_based(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Rule-based classification using regex pattern matching.
        
        Args:
            text: User input text
            
        Returns:
            Classification result or None
        """
        result = self.command_registry.match_phrase(text)
        return result
    
    async def _classify_llm(self, text: str, context: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
        """
        LLM-based classification using Groq or Gemini.
        
        Args:
            text: User input text
            context: Recent command context
            
        Returns:
            Classification result or None
        """
        # Try Groq first (faster)
        if self.groq_client:
            try:
                result = await self._classify_groq(text, context)
                if result:
                    return result
            except Exception as e:
                print(f"[ERROR] Groq classification failed: {e}")
        
        # Fallback to Gemini
        if self.gemini_model:
            try:
                result = await self._classify_gemini(text, context)
                if result:
                    return result
            except Exception as e:
                print(f"[ERROR] Gemini classification failed: {e}")
        
        return None
    
    async def _classify_groq(self, text: str, context: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
        """Classify using Groq LLM."""
        if self.groq_client is None:
            return None
        
        prompt = self._build_llm_prompt(text, context)
        
        try:
            response = await self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are an intent classifier for a database visualization platform. Respond ONLY with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=200
            )
            
            content = response.choices[0].message.content.strip()
            
            if '```json' in content:
                content = content.split('```json')[1].split('```')[0].strip()
            elif '```' in content:
                content = content.split('```')[1].split('```')[0].strip()
            
            result = json.loads(content)
            
            return {
                'intent': result.get('intent', 'unknown'),
                'action': self.command_registry.get_action_for_intent(result.get('intent', '')),
                'parameters': result.get('parameters', {}),
                'confidence': result.get('confidence', 0.7),
                'method': 'groq_llm',
                'alternatives': result.get('alternatives', [])
            }
        except Exception as e:
            print(f"[ERROR] Groq classification internal error: {e}")
            return None
    
    async def _classify_gemini(self, text: str, context: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
        """Classify using Gemini LLM."""
        if not self.gemini_model:
            return None
        
        prompt = self._build_llm_prompt(text, context)
        
        try:
            response = await self.gemini_model.generate_content_async(prompt)
            content = response.text.strip()
            
            # Extract JSON
            if '```json' in content:
                content = content.split('```json')[1].split('```')[0].strip()
            elif '```' in content:
                content = content.split('```')[1].split('```')[0].strip()
            
            result = json.loads(content)
            
            return {
                'intent': result.get('intent', 'unknown'),
                'action': self.command_registry.get_action_for_intent(result.get('intent', '')),
                'parameters': result.get('parameters', {}),
                'confidence': result.get('confidence', 0.7),
                'method': 'gemini_llm',
                'alternatives': result.get('alternatives', [])
            }
            
        except Exception as e:
            print(f"[ERROR] Gemini classification error: {e}")
            return None
    
    def _build_llm_prompt(self, text: str, context: Optional[List[str]] = None) -> str:
        """Build the LLM prompt for intent classification."""
        # Get available commands
        commands = self.command_registry.get_all_commands()
        
        command_list = "\n".join([
            f"- {cmd['intent']}: {cmd['description']} (params: {list(cmd.get('parameters', {}).keys())})"
            for cmd in commands
        ])
        
        context_str = ""
        if context:
            context_str = f"\n\nRecent commands:\n" + "\n".join([f"- {c}" for c in context[-3:]])
        
        prompt = f"""Classify the following voice command into one of the available intents.

Available Intents:
{command_list}

User Command: "{text}"{context_str}

Respond with ONLY a JSON object in this exact format:
{{
  "intent": "intent_name",
  "parameters": {{"param_name": "value"}},
  "confidence": 0.95,
  "alternatives": ["alternative_intent1", "alternative_intent2"]
}}

Rules:
1. Choose the most appropriate intent from the available list
2. Extract any parameters mentioned (e.g., table names, cluster names)
3. Set confidence between 0.0 and 1.0
4. Provide 1-2 alternative intents if unsure
5. Use "unknown" intent if no good match exists
"""
        return prompt
    
    def _classify_fuzzy(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Fuzzy matching based on keyword overlap.
        
        Args:
            text: User input text
            
        Returns:
            Classification result or None
        """
        text_lower = text.lower()
        words = set(text_lower.split())
        
        best_match = None
        best_score = 0.0
        
        for cmd in self.command_registry.get_all_commands():
            for phrase in cmd['phrases']:
                phrase_words = set(phrase.lower().replace('{', '').replace('}', '').split())
                # Calculate word overlap
                overlap = len(words & phrase_words)
                score = overlap / max(len(words), len(phrase_words))
                
                if score > best_score and score > 0.3:  # 30% minimum overlap
                    best_score = score
                    best_match = cmd
        
        if best_match:
            return {
                'intent': best_match['intent'],
                'action': best_match['action'],
                'parameters': {},  # Can't extract params reliably in fuzzy mode
                'confidence': best_score,
                'method': 'fuzzy_match',
                'note': 'Parameter extraction may be incomplete'
            }
        
        return None
    
    def _get_suggestions(self, text: str) -> List[str]:
        """Get command suggestions based on failed input."""
        examples = self.command_registry.get_examples()
        return examples[:3]  # Return top 3 examples
    
    def add_to_history(self, text: str, classification: Dict[str, Any]) -> None:
        """
        Add a classification to history for context.
        
        Args:
            text: Original user text
            classification: Classification result
        """
        self.history.append({
            'text': text,
            'intent': classification.get('intent'),
            'timestamp': None  # Could add timestamp
        })
        
        # Keep only recent history
        if len(self.history) > self.max_history:
            self.history = self.history[-self.max_history:]
    
    def get_context(self) -> List[str]:
        """Get recent commands as context strings."""
        return [h['text'] for h in self.history]


# Global instance
_classifier_instance: Optional[IntentClassifier] = None


def get_intent_classifier() -> IntentClassifier:
    """
    Get the global intent classifier instance (Singleton pattern).
    
    Returns:
        IntentClassifier instance
    """
    global _classifier_instance
    if _classifier_instance is None:
        _classifier_instance = IntentClassifier()
    return _classifier_instance
