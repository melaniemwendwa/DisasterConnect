import os
import json
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def classify_disaster_type(description):
    """
    Uses OpenAI API to classify the disaster type based on the description.
    
    Args:
        description (str): The disaster description text
        
    Returns:
        dict: {
            'type': str,           # The disaster category
            'confidence': float,   # Confidence score (0-1)
            'explanation': str     # Reasoning for the classification
        }
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are a disaster classification expert. Classify the disaster into ONE of these categories:
- Fire
- Flood
- Earthquake
- Hurricane
- Tornado
- Drought
- Landslide
- Tsunami
- Volcanic Eruption
- Winter Storm
- Wildfire
- Epidemic
- Other

Return your response as a JSON object with these fields:
{
  "type": "category name",
  "confidence": 0.95,
  "explanation": "brief reason for classification"
}

Example:
{
  "type": "Wildfire",
  "confidence": 0.92,
  "explanation": "Description mentions uncontrolled fire spreading through forest area"
}"""
                },
                {
                    "role": "user",
                    "content": f"Classify this disaster report: {description}"
                }
            ],
            temperature=0.3,
            max_tokens=150
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Parse JSON response
        try:
            result = json.loads(result_text)
            disaster_type = result.get('type', 'Other')
            confidence = float(result.get('confidence', 0.5))
            explanation = result.get('explanation', 'No explanation provided')
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            disaster_type = result_text.split('\n')[0] if result_text else 'Other'
            confidence = 0.5
            explanation = "Unable to parse AI response"
        
        print(f"[OpenAI] Classified disaster type: {disaster_type} (confidence: {confidence})")
        
        return {
            'type': disaster_type,
            'confidence': confidence,
            'explanation': explanation
        }
        
    except Exception as e:
        print(f"[OpenAI Error] Failed to classify disaster type: {str(e)}")
        # Fallback to "Other" if API fails
        return {
            'type': 'Other',
            'confidence': 0.0,
            'explanation': f'Classification failed: {str(e)}'
        }


def classify_severity(description):
    """
    Uses OpenAI API to classify the severity of the disaster based on the description.
    
    Args:
        description (str): The disaster description text
        
    Returns:
        dict: {
            'severity': str,       # The severity level
            'confidence': float,   # Confidence score (0-1)
            'explanation': str     # Reasoning for the assessment
        }
    """
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """You are a disaster severity assessment expert. Classify the disaster severity into ONE of these categories:
- Minor: Small-scale incidents with limited impact, contained situations, minimal damage
- Moderate: Medium-scale incidents with moderate impact, some damage, affects a limited area
- Severe: Large-scale catastrophic incidents, extensive damage, widespread impact, life-threatening

Return your response as a JSON object with these fields:
{
  "severity": "severity level",
  "confidence": 0.88,
  "explanation": "brief reason for severity assessment"
}

Example:
{
  "severity": "Severe",
  "confidence": 0.95,
  "explanation": "Description indicates widespread destruction and life-threatening conditions"
}"""
                },
                {
                    "role": "user",
                    "content": f"Assess the severity of this disaster report: {description}"
                }
            ],
            temperature=0.3,
            max_tokens=150
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Parse JSON response
        try:
            result = json.loads(result_text)
            severity = result.get('severity', 'Moderate')
            confidence = float(result.get('confidence', 0.5))
            explanation = result.get('explanation', 'No explanation provided')
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            severity = result_text.split('\n')[0] if result_text else 'Moderate'
            confidence = 0.5
            explanation = "Unable to parse AI response"
        
        print(f"[OpenAI] Classified severity: {severity} (confidence: {confidence})")
        
        return {
            'severity': severity,
            'confidence': confidence,
            'explanation': explanation
        }
        
    except Exception as e:
        print(f"[OpenAI Error] Failed to classify severity: {str(e)}")
        # Fallback to "Moderate" if API fails
        return {
            'severity': 'Moderate',
            'confidence': 0.0,
            'explanation': f'Classification failed: {str(e)}'
        }
