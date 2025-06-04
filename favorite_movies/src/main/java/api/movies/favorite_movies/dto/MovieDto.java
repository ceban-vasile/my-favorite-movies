package api.movies.favorite_movies.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDto {
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String director;
    private Integer year;
    private String genre;
    private String posterUrl;
    private String description;
    private Double rating;
}
