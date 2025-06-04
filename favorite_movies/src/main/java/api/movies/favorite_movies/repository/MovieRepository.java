package api.movies.favorite_movies.repository;

import api.movies.favorite_movies.model.Movie;
import api.movies.favorite_movies.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    List<Movie> findAllByUser(User user);
}
