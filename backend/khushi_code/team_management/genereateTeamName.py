import openai

openai.api_key = "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"

def lambda_handler(event, context):
    prompt = event['prompt']
    generated_name = generate_name(prompt)
    
    return {
        "statusCode": 200,
        "body": generated_name
    }


def generate_name(prompt):
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=50,
        temperature=0.7
    )
    return response.choices[0].text.strip()
