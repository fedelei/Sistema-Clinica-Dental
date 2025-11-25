package com.fedelei.clinica_dental.configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // Puedes proporcionar la clave como Base64 o como HEX. Si el valor no es Base64 válido,
    // el código intentará decodificarlo como HEX.
    private static final String SECRET_KEY = "6bf0631b5ea3ccb90158372e2208f7a683a90896158eb70be7242c5334480306";
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(UserDetails userDetails)   {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(
            Map<String, Object> extractClaims,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .setClaims(extractClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public<T> T extractClaim(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        // Intentamos decodificar como Base64; si falla, lo interpretamos como HEX
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        } catch (Exception e) {
            keyBytes = hexStringToByteArray(SECRET_KEY);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        if (len % 2 != 0) {
            throw new IllegalArgumentException("Hex string must have even length");
        }
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            int hi = Character.digit(s.charAt(i), 16);
            int lo = Character.digit(s.charAt(i+1), 16);
            if (hi == -1 || lo == -1) throw new IllegalArgumentException("Invalid hex character");
            data[i / 2] = (byte) ((hi << 4) + lo);
        }
        return data;
    }

}
