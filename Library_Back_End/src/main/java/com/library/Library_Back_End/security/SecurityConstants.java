package com.library.Library_Back_End.security;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Base64;

public class SecurityConstants {
    public static final long JWT_EXPIRATION = 360000000; //3600000 = 1 hour in milliseconds
    public static final byte[] SECRET_KEY_BYTES = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
    public static final String SECRET_KEY = Base64.getEncoder().encodeToString(SECRET_KEY_BYTES);
    public static final String BEARER = "Bearer ";
}
