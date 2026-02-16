"""
Token encryption/decryption helpers using Fernet symmetric encryption.
Tokens are encrypted before being stored in the database and decrypted on read.
"""
import os
import logging
from cryptography.fernet import Fernet, InvalidToken

logger = logging.getLogger(__name__)

_fernet = None
_encryption_available = False


def _get_fernet():
    """Lazily initialise and cache the Fernet instance."""
    global _fernet, _encryption_available
    if _fernet is not None:
        return _fernet

    key = os.environ.get('TOKEN_ENCRYPTION_KEY')
    if not key:
        logger.warning(
            "TOKEN_ENCRYPTION_KEY is not set — tokens will be stored in PLAINTEXT. "
            "Generate one with: python3 -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\""
        )
        _encryption_available = False
        return None

    try:
        _fernet = Fernet(key.encode() if isinstance(key, str) else key)
        _encryption_available = True
    except Exception:
        logger.error("TOKEN_ENCRYPTION_KEY is invalid — tokens will be stored in PLAINTEXT.")
        _encryption_available = False
        return None

    return _fernet


def encrypt_token(plaintext):
    """Encrypt a token string. Returns the encrypted string, or the original if encryption is unavailable."""
    if not plaintext:
        return plaintext

    f = _get_fernet()
    if f is None:
        return plaintext

    return f.encrypt(plaintext.encode()).decode()


def decrypt_token(ciphertext):
    """Decrypt a token string. Falls back to returning the raw value if decryption fails (e.g. legacy plaintext)."""
    if not ciphertext:
        return ciphertext

    f = _get_fernet()
    if f is None:
        return ciphertext

    try:
        return f.decrypt(ciphertext.encode()).decode()
    except InvalidToken:
        # Legacy plaintext token — return as-is (user will re-encrypt on next login)
        logger.warning("Failed to decrypt token — likely a legacy plaintext value. Will re-encrypt on next write.")
        return ciphertext
