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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/movies")
@Tag(name = "Movies", description = "Movie management API")
@SecurityRequirement(name = "Bearer Authentication")
public class MovieController {
    
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    
    public MovieController(MovieRepository movieRepository, UserRepository userRepository) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }
    
    @Operation(summary = "Get all movies", description = "Returns all movies for the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of movies retrieved", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Movie.class)))),
        @ApiResponse(responseCode = "401", description = "Unauthorized", 
                content = @Content)
    })
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
    
    @Operation(summary = "Get movie by ID", description = "Returns a movie by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Movie found", 
                content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = Movie.class))),
        @ApiResponse(responseCode = "404", description = "Movie not found", 
                content = @Content),
        @ApiResponse(responseCode = "401", description = "Unauthorized", 
                content = @Content)
    })
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
    
    @Operation(summary = "Create new movie", description = "Adds a new movie to the user's collection")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Movie created", 
                content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = Movie.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input", 
                content = @Content),
        @ApiResponse(responseCode = "401", description = "Unauthorized", 
                content = @Content)
    })
    @PostMapping
    public ResponseEntity<Movie> addMovie(@RequestBody Movie movie, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));
        
        movie.setUser(user);
        Movie savedMovie = movieRepository.save(movie);
        
        return ResponseEntity.ok(savedMovie);
    }
    
    @Operation(summary = "Update movie", description = "Updates an existing movie")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Movie updated", 
                content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = Movie.class))),
        @ApiResponse(responseCode = "404", description = "Movie not found", 
                content = @Content),
        @ApiResponse(responseCode = "401", description = "Unauthorized", 
                content = @Content)
    })
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
    
    @Operation(summary = "Delete movie", description = "Deletes a movie by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Movie deleted", 
                content = @Content),
        @ApiResponse(responseCode = "404", description = "Movie not found", 
                content = @Content),
        @ApiResponse(responseCode = "401", description = "Unauthorized", 
                content = @Content)
    })
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
