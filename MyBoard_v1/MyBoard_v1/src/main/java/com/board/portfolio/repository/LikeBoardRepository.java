package com.board.portfolio.repository;

import com.board.portfolio.domain.entity.LikeBoard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeBoardRepository extends JpaRepository<LikeBoard,String>, LikeBoardRepositoryCustom {
}
