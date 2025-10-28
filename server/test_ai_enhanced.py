"""
Test script for enhanced OpenAI disaster classification with confidence & explanations
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import AI utilities
from ai_utils import classify_disaster_type, classify_severity

def test_enhanced_classification():
    """Test enhanced disaster classification with confidence scores and explanations"""
    
    print("=" * 80)
    print("TESTING ENHANCED OPENAI CLASSIFICATION")
    print("WITH CONFIDENCE SCORES & EXPLANATIONS")
    print("=" * 80)
    
    # Check if API key is set
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("\n❌ ERROR: OPENAI_API_KEY not found in environment variables!")
        print("Please add OPENAI_API_KEY to your .env file\n")
        return
    
    print(f"\n✅ API Key found: {api_key[:10]}...{api_key[-4:]}\n")
    
    # Test cases
    test_cases = [
        "Large wildfire burning through forest destroying multiple homes",
        "Heavy flooding in downtown area, water level rising rapidly",
        "Small kitchen fire quickly contained by firefighters",
        "Massive earthquake 7.8 magnitude, buildings collapsing everywhere",
    ]
    
    for i, description in enumerate(test_cases, 1):
        print(f"\n{'='*80}")
        print(f"TEST CASE {i}")
        print(f"{'='*80}")
        print(f"Description: {description}")
        print(f"\n{'─'*80}")
        
        # Classify disaster type
        print("\n🔍 Classifying Disaster Type...")
        type_result = classify_disaster_type(description)
        
        print(f"\n📊 DISASTER TYPE RESULTS:")
        print(f"   Type:        {type_result['type']}")
        print(f"   Confidence:  {type_result['confidence']:.2%}")
        print(f"   Explanation: {type_result['explanation']}")
        
        # Classify severity
        print(f"\n🔍 Assessing Severity...")
        severity_result = classify_severity(description)
        
        print(f"\n📊 SEVERITY RESULTS:")
        print(f"   Severity:    {severity_result['severity']}")
        print(f"   Confidence:  {severity_result['confidence']:.2%}")
        print(f"   Explanation: {severity_result['explanation']}")
        
        print(f"\n{'─'*80}")
    
    print(f"\n{'='*80}")
    print("✅ ALL ENHANCED TESTS COMPLETED!")
    print(f"{'='*80}\n")
    
    print("💡 KEY IMPROVEMENTS:")
    print("   1. ✅ Confidence scores (0-100%) for transparency")
    print("   2. ✅ AI explanations for each classification")
    print("   3. ✅ Better trust and debugging capabilities")
    print("   4. ✅ Data enriched for frontend display")
    print()

if __name__ == "__main__":
    test_enhanced_classification()
