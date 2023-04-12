package cbnu.software.repository;

import cbnu.software.Entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileEntity,Long> {
    FileEntity findByStoredFileName(String storedFileName);
}
