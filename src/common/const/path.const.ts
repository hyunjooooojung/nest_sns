import path from "path";

// PROJECT 루트 경로
export const PROJECT_ROOT_PATH = process.cwd();

// 외부에서 접근 가능한 파일들을 저장할 경로
export const PUBLIC_DIRECTORY_NAME = 'public';

// 게시글 이미지를 저장할 경로
export const POSTS_DIRECTORY_NAME = 'posts';

// 임시폴더 이름
export const TEMP_DIRECTORY_NAME = 'temp';

// 실제 공개 폴더의 절대 경로
export const PUBLIC_DIRECTORY_PATH = path.join(
    PROJECT_ROOT_PATH, 
    PUBLIC_DIRECTORY_NAME
);

// 게시글 이미지를 저장할 경로의 절대 경로
export const POSTS_IMAGE_PATH = path.join(
    PUBLIC_DIRECTORY_PATH,
    POSTS_DIRECTORY_NAME
);

// 절대 경로 X
export const POST_PUBLIC_IMAGE_PATH = path.join(
    PUBLIC_DIRECTORY_NAME,
    POSTS_DIRECTORY_NAME,
)

// 임시폴더 경로
export const TEMP_DIRECTORY_PATH = path.join(
    PUBLIC_DIRECTORY_PATH,
    TEMP_DIRECTORY_NAME,
)
