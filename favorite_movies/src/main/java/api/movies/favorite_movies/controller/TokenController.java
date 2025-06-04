package api.movies.favorite_movies.controller;

import api.movies.favorite_movies.dto.TokenRequest;
import api.movies.favorite_movies.dto.TokenResponse;
import api.movies.favorite_movies.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashSet;

@RestController
@RequestMapping("/token")
@Tag(name = "Token API", description = "API for generating JWT tokens")
public class TokenController {

    private final JwtService jwtService;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public TokenController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping
    @Operation(summary = "Generate token with role and permissions")
    public ResponseEntity<TokenResponse> generateToken(@RequestBody TokenRequest tokenRequest) {
        String token = jwtService.generateToken(
            "user",
            tokenRequest.getRole(),
            tokenRequest.getPermissions() != null ? tokenRequest.getPermissions() : new HashSet<>()
        );
        
        return ResponseEntity.ok(new TokenResponse(token, jwtExpiration));
    }

    @GetMapping
    @Operation(summary = "Generate token with query parameters")
    public ResponseEntity<TokenResponse> generateToken(
            @RequestParam(required = false, defaultValue = "VISITOR") String role,
            @RequestParam(required = false, defaultValue = "READ") String permission) {
        
        TokenRequest request = new TokenRequest();
        try {
            request.setRole(api.movies.favorite_movies.model.Role.valueOf(role.toUpperCase()));
            request.setPermissions(Collections.singleton(api.movies.favorite_movies.model.Permission.valueOf(permission.toUpperCase())));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        
        String token = jwtService.generateToken(
            "user",
            request.getRole(),
            request.getPermissions()
        );
        
        return ResponseEntity.ok(new TokenResponse(token, jwtExpiration));
    }
}
