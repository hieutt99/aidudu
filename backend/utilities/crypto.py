import hashlib,base64 

def hash_password(message,IV='AAAAAAAAAA',itr=1):
    return f"pbkdf2_sha256${itr}${IV}${base64.b64encode(hashlib.pbkdf2_hmac('sha256',message.encode(),IV.encode(),itr)).decode()}"

if __name__=='__main__':
    print(hash_password('AAAAA'))