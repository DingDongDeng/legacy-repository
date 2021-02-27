package com.board.portfolio.validation.validator.constraint;

import com.board.portfolio.repository.BoardRepository;
import com.board.portfolio.validation.anotation.BoardIdExist;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

@Component
@RequiredArgsConstructor
public class BoardIdExistValidator implements ConstraintValidator<BoardIdExist, Long> {
    @Autowired
    private BoardRepository boardRepository;

    @Override
    public void initialize(BoardIdExist boardIdExist) {
    }
    @Override
    public boolean isValid(Long boardId, ConstraintValidatorContext cxt) {
        boolean isExistBoardId = boardRepository.existsById(boardId);
        return isExistBoardId;
    }
}