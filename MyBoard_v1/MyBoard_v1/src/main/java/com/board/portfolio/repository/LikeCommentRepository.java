package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.LikeComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeCommentRepository extends JpaRepository<LikeComment,String>, LikeCommentRepositoryCustom {


}
