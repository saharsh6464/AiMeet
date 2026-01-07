package com.saharsh.AiMeet.Dto;


import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicDto {
    private Long id;

    private int userId;

    private String name;

    private String topicAccessId; // The ID users enter

    private String accessPassword;

}
