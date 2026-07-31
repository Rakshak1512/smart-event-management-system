from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

password = input("Enter password: ")

hashed_password = pwd_context.hash(password)

print("\nHashed Password:")
print(hashed_password)