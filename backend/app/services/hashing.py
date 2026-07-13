import hashlib


def sha256_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8").strip().lower()).hexdigest()


def normalize_phone_morocco(phone: str) -> str:
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) == 12 and digits.startswith("212"):
        digits = "0" + digits[3:]
    elif len(digits) == 13 and digits.startswith("0212"):
        digits = "0" + digits[4:]
    if len(digits) == 10 and digits[0] == "0":
        return digits
    return phone


def normalize_phone_tiktok(phone: str) -> str:
    digits = "".join(c for c in phone if c.isdigit())
    if len(digits) == 10 and digits.startswith("0"):
        digits = "212" + digits[1:]
    elif len(digits) == 12 and digits.startswith("212"):
        pass
    elif len(digits) == 13 and digits.startswith("0212"):
        digits = digits[1:]
    return "+" + digits


def hash_email(email: str) -> str:
    return sha256_hash(email)


def hash_phone_meta(phone: str) -> str:
    return sha256_hash(normalize_phone_morocco(phone))


def hash_phone_tiktok(phone: str) -> str:
    return sha256_hash(normalize_phone_tiktok(phone))


def hash_phone_snapchat(phone: str) -> str:
    return sha256_hash(normalize_phone_morocco(phone))
