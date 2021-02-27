package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Board;

import java.util.List;

public interface BoardRepositoryCustom {
    List<Board> getBoardList(long startNum, int pageSize);
}
