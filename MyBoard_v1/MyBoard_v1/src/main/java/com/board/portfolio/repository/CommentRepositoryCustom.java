package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.Account;
import com.board.portfolio.domain.entity.Board;
import com.board.portfolio.domain.entity.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentRepositoryCustom {
    List<Comment> getCommentList(Board board);
    Optional<Comment> getChildComment(Board board, Long group, Long commentId);
    List<Comment> getLikedCommentList(Board board, Account account);
}
