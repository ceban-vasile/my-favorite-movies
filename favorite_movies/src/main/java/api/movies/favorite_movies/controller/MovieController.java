package api.movies.favorite_movies.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import api.movies.favorite_movies.model.Movie;
import api.movies.favorite_movies.model.User;
import api.movies.favorite_movies.repository.MovieRepository;
import api.movies.favorite_movies.repository.UserRepository;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    
    public MovieController(MovieRepository movieRepository, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }
    
    @GetMapping
    public ResponseEntity<Page<Movie>> getUserMovies(
            Principal principal,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        PageRequest pageRequest = PageRequest.of(page, size);
        
        // Check if we're searching by title or getting all movies
        if (title != null && !title.isEmpty()) {
            Page<Movie> movies = movieRepository.findByTitleContainingIgnoreCaseAndUser(title, user, pageRequest);
            return ResponseEntity.ok(movies);
        } else {
            Page<Movie> movies = movieRepository.findByUser(user, pageRequest);
            return ResponseEntity.ok(movies);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        Optional<Movie> movieOpt = movieRepository.findByIdAndUser(id, user);
        
        if (movieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(movieOpt.get());
    }
    
    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        movie.setUser(user);
        Movie savedMovie = movieRepository.save(movie);
        
        return ResponseEntity.ok(savedMovie);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie movieDetails, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        Optional<Movie> movieOpt = movieRepository.findByIdAndUser(id, user);
        
        if (movieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Movie movie = movieOpt.get();
        movie.setTitle(movieDetails.getTitle());
        movie.setGenre(movieDetails.getGenre());
        movie.setYear(movieDetails.getYear());
        movie.setPosterUrl(movieDetails.getPosterUrl());
        movie.setDescription(movieDetails.getDescription());
        movie.setDirector(movieDetails.getDirector());
        movie.setRating(movieDetails.getRating());
        
        Movie updatedMovie = movieRepository.save(movie);
        return ResponseEntity.ok(updatedMovie);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        Optional<Movie> movieOpt = movieRepository.findByIdAndUser(id, user);
        
        if (movieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        movieRepository.delete(movieOpt.get());
        return ResponseEntity.ok().build();
    }
}
