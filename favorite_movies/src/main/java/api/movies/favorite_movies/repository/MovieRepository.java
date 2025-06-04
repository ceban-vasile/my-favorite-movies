package api.movies.favorite_movies.repository;

import api.movies.favorite_movies.model.Movie;
import api.movies.favorite_movies.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findAllByUser(User user);
    
    Page<Movie> findByTitleContainingIgnoreCaseAndUser(String title, User user, Pageable pageable);
    
    Page<Movie> findByUser(User user, Pageable pageable);
    
    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    Optional<Movie> findByIdAndUser(Long id, User user);
}
