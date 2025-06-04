package api.movies.favorite_movies.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import api.movies.favorite_movies.model.User;
import api.movies.favorite_movies.repository.UserRepository;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        // Create authorities from user role
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        
        // Add role-based authority
        if (user.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        }
        
        // The User class already implements UserDetails, so we can just return it
        return user;
    }
    
    // Helper method to map permissions to authorities (if needed in the future)
    private List<SimpleGrantedAuthority> mapPermissionsToAuthorities(Collection<?> permissions) {
        return permissions.stream()
                .map(permission -> new SimpleGrantedAuthority(permission.toString()))
                .collect(Collectors.toList());
    }
}
