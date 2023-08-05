# https://dev.to/a0viedo/writing-to-a-google-sheet-using-serverless-2ndc

import boto3
import csv
import gspread
from oauth2client.service_account import ServiceAccountCredentials

def lambda_handler(event, context):
    # read data from DynamoDB
    dynamodb = boto3.resource('dynamodb')
    table_name = 'trivia-games'
    table = dynamodb.Table(table_name)
    response = table.scan()

    #Write data to CSV
    data = response['Items']
    csv_file_path = '/tmp/data.csv'
    with open(csv_file_path, 'w', newline='') as csv_file:
        fieldnames = ['gameID', 'averageDuration', 'gameName', 'playerCount', 'playSessions', 'timePlayed']  
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for item in data:
            writer.writerow(item)

    #  Authenticate with Google Sheets API
    scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/drive']
     service_account_json = '''
        {
          "type": "service_account",
          "project_id": "dwa-lab5",
          "private_key_id": "e7416d82db8c551b2fe71613f27dfb7d2cc97404",
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQClqgr67iW8C4xj\n29OGWVp5/RrVHajNxnhuUONXFJh+qyXrMfrFWn3B2wRYihbHWiVTo/CwMNXCp0of\nyQlsxlcW1md/LoGSRXjPgYI7M2+cjzsolrWBiH1mTF0fOOYxPWz2IWv1IihicDik\n20w6ggiAxgqvJVbTo/04XIj1ESIkcivTgM+tmMUpx5n2v7EwN+E1OnN26PquX5c8\njtHRKMBy/4kGLj1wozKd9918y32qIXwNjjp+b5K71PoKQ7wMj5knEJ8m1APTguSQ\nGqLCltb5ELF5o2xOHZ7gr2eXRIM7NnifeCTwsRd9fItD1TbCkyFysTgvyoy5Oa8h\no6WwYWv5AgMBAAECggEAGEuYCSVgWNPbvrBYNOGJTI8jPoJ3RVhYRJttv9FYLOl2\nKeg+Re+ntkSjvkVgIlPU2g+Wpow+6SlmDEPMM0ziLEn8yzDblUNFfK8aVYrNUUlL\nLIBvtYO6GkTUOlY6ohmHT5BmuABOqmMZV4oGw6Ta0OHaYsXH1kl8QyYE+uXMm0n7\nt+QJB0O4l3yggjNm9C4oo/ZGcKuzZU1DPde4y039Hqw3gtjzZgmkGhacq3E2sIHA\nTqUwMqS3toNm1yl2Npq/0ZlFCXdhUDCxz/nl0McoPnIIAsjPyY95e4FmkfYCJZuv\nI+2nl7jPAwc4JBHsqgzpyR1AwnyUaTToaKRCemaz1QKBgQDUEgT81yV4WWZdQaw5\ngZe4efUWw2muHmLutz4dYT67+QBJ+VB2UqjvAsbiyMCr5a4P4IoYTDwOOv8yvhZa\nDApi7lXPPoknE1326i6MWmZSgZ7ua8Wso3ao3r4/koNw5DWZObpGmXOKP6mZqXFa\nl2ZteBbnk8KXKzT3/MztZ/Z4NQKBgQDH+yEeY0kNq0pxqBLbgMGhnracrJ8euQco\nfO0SPxxGIO61GoEzIX4PKxBN1ncMjyzFM3ErhC5GNBT7TumlQTm8UmQA6sBzTIa0\n/W8emXBvb2ZZjKRygB10TNSpOWPxzuaXFETvtCd4q4JhXUlfGkCcWj/q4d+fXj0+\n/yiN2SuFNQKBgGl4dMaS8e3C+KgUy2TmUODMttoVYe/Y6Pc0Z04RWTP/iOdBeYT/\nY0lLpkKP+VMErebzk3q2H4AsU1OXOmKabmf5hO/HeErY1PjCS1g+dXk/Qh3tt6g+\nu/sMnK3dXkW9GfMUxNHr64ysUNs9bETT23tCKJIP6M1qDbPwJLNF60ypAoGAawjh\nmAciAZvtk1mXBj8q5BszuDW4UNRNnYEHzl1S/8H+oZYXEsvZUbsF1fN08pbrKn03\nFEiCD/cuR7fb3CRGB6K9fbQn305VRyfiQqlzgWFJkaJyHgquOSIqLIzYDoNj7fbe\nUsHE4pRBi2VHsQw3CrhPP6M3cnAZLc+Z4BodbgUCgYEAirCpqFSY2QwNwvP+f2t/\nq7JFA0dbxSVJJfApuiU/5LmCnWNIkkYgu2xQYRrQRJSKSXaujDJiVlgEZ0CkvzzG\nqIfiMLBqxCf1BGac5EtCO6SGVRycIzi00VZBQxM9McaFWAD0ZN5Bmlt6NTf7FHAs\nHn8MNmjujljUPL18kM3Wzs0=\n-----END PRIVATE KEY-----\n",
          "client_email": "id-5410-project@dwa-lab5.iam.gserviceaccount.com",
          "client_id": "107191998332193067614",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://oauth2.googleapis.com/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/id-5410-project%40dwa-lab5.iam.gserviceaccount.com",
          "universe_domain": "googleapis.com"
        }

    '''
    
    credentials = ServiceAccountCredentials.from_json_keyfile_dict(json.loads(service_account_json), scope)
    gc = gspread.authorize(credentials)

    # Send data to Google Sheet
    spreadsheet_id = '19tHJIxcRO5R7JHNMFS8419QOLQD5AWIPuEH4rOPjfSo'
    worksheet_name = 'gameplay-data.csv'
    sh = gc.open_by_key(spreadsheet_id)
    worksheet = sh.worksheet(worksheet_name)
    with open(csv_file_path, 'r') as csv_file:
        csv_content = csv_file.read()
        gc.import_csv(spreadsheet_id, worksheet.id, csv_content)

    return {
        'statusCode': 200,
        'body': 'Data exported to Google Sheets successfully.'
    }