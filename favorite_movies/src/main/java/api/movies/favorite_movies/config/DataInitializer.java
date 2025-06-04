package api.movies.favorite_movies.config;

import api.movies.favorite_movies.model.Movie;
import api.movies.favorite_movies.model.Permission;
import api.movies.favorite_movies.model.Role;
import api.movies.favorite_movies.model.User;
import api.movies.favorite_movies.repository.MovieRepository;
import api.movies.favorite_movies.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, 
                                     MovieRepository movieRepository, 
                                     PasswordEncoder passwordEncoder) {
        return args -> {
            // Create admin user
            User adminUser = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .role(Role.ADMIN)
                    .permissions(Set.of(Permission.READ, Permission.WRITE, Permission.DELETE))
                    .build();
            userRepository.save(adminUser);

            // Create writer user
            User writerUser = User.builder()
                    .username("writer")
                    .password(passwordEncoder.encode("writer"))
                    .role(Role.WRITER)
                    .permissions(Set.of(Permission.READ, Permission.WRITE))
                    .build();
            userRepository.save(writerUser);

            // Create visitor user
            User visitorUser = User.builder()
                    .username("visitor")
                    .password(passwordEncoder.encode("visitor"))
                    .role(Role.VISITOR)
                    .permissions(Set.of(Permission.READ))
                    .build();
            userRepository.save(visitorUser);

            // Create sample movies
            movieRepository.saveAll(Arrays.asList(
                new Movie(null, "The Shawshank Redemption", "Frank Darabont", 1994, "Drama", 
                        "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
                        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", 9.3),
                new Movie(null, "The Godfather", "Francis Ford Coppola", 1972, "Crime, Drama", 
                        "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
                        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", 9.2),
                new Movie(null, "The Dark Knight", "Christopher Nolan", 2008, "Action, Crime, Drama", 
                        "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
                        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", 9.0)
            ));
        };
    }
}
