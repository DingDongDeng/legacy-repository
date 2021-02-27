package com.board.portfolio.domain.dto;

import com.board.portfolio.validation.anotation.BoardIdExist;
import lombok.Data;

@Data
public class FileDTO {
    @BoardIdExist(message = "{board.exist}")
    private Long boardId;

    private String email;

    private String fileId;
}
