package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.Board;
import com.board.portfolio.domain.entity.LikeBoard;

import java.util.Optional;

public interface LikeBoardRepositoryCustom {
    Optional<LikeBoard> findByBoardAndAccount(Board board, Account account);
}
