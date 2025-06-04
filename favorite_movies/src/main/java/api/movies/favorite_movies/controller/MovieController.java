package main.java.api.movies.favorite_movies.controller;

import api.movies.favorite_movies.dto.MovieDto;
import api.movies.favorite_movies.model.Movie;
import api.movies.favorite_movies.model.User;
import api.movies.favorite_movies.repository.MovieRepository;
import api.movies.favorite_movies.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/movies")
@Tag(name = "Movies API", description = "API for managing movies")
@SecurityRequirement(name = "bearerAuth")
public class MovieController {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public MovieController(MovieRepository movieRepository, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    @Operation(summary = "Get all movies with pagination")
    public ResponseEntity<Page<Movie>> getAllMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Principal principal
    ) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Movie> movies;
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        if (title != null && !title.isEmpty()) {
            movies = movieRepository.findByTitleContainingIgnoreCaseAndUser(title, user, pageRequest);
        } else {
            movies = movieRepository.findAllByUser(user, pageRequest);
        }

        return ResponseEntity.ok(movies);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    @Operation(summary = "Get a movie by ID")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return movieRepository.findByIdAndUser(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PERMISSION_WRITE')")
    @Operation(summary = "Create a new movie")
    public ResponseEntity<Movie> createMovie(@Valid @RequestBody MovieDto movieDto, Principal principal) {
        Movie movie = new Movie();
        mapDtoToMovie(movieDto, movie);

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        movie.setUser(user);

        Movie savedMovie = movieRepository.save(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_WRITE')")
    @Operation(summary = "Update an existing movie")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieDto movieDto, Principal principal) {
        Optional<Movie> optionalMovie = movieRepository.findById(id);

        if (optionalMovie.isPresent()) {
            Movie movie = optionalMovie.get();
            User user = userRepository.findByUsername(principal.getName())
                    .orElseThrow(() -> new IllegalStateException("User not found"));

            if (!movie.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Not authorized to update this movie");
            }

            mapDtoToMovie(movieDto, movie);

            Movie updatedMovie = movieRepository.save(movie);
            return ResponseEntity.ok(updatedMovie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_DELETE')")
    @Operation(summary = "Delete a movie")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id, Principal principal) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Movie not found"));

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!movie.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not authorized to delete this movie");
        }

        movieRepository.delete(movie);
        return ResponseEntity.ok().build();
    }

    private void mapDtoToMovie(MovieDto dto, Movie movie) {
        movie.setTitle(dto.getTitle());
        movie.setDirector(dto.getDirector());
        movie.setYear(dto.getYear());
        movie.setGenre(dto.getGenre());
        movie.setPosterUrl(dto.getPosterUrl());
        movie.setDescription(dto.getDescription());
        movie.setRating(dto.getRating());
    }
}
