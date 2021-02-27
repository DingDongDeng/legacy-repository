package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.Comment;
import com.board.portfolio.domain.entity.LikeComment;

import java.util.Optional;

public interface LikeCommentRepositoryCustom {
    Optional<LikeComment> findByCommentAndAccount(Comment comment, Account account);
}
