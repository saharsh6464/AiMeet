package com.saharsh.AiMeet.Dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubtopicDto {
    String topicAccessId;
    String accessPassword;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

}
