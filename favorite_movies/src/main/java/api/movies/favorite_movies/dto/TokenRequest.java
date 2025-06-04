package api.movies.favorite_movies.dto;

import api.movies.favorite_movies.model.Permission;
import api.movies.favorite_movies.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenRequest {
    private Role role;
    private Set<Permission> permissions;
}
