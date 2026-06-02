import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export abstract class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  // 이전 마지막 데이터의 ID
  // 이 프로퍼티에 입력된 ID보다 높은 ID 부터 값을 가져오기
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  // 이 프로퍼티에 입력된 ID보다 낮은 ID 부터 값을 가져오기
  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  // 정렬
  // createdAt 기준으로 오름차순/내림차순 정렬
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt?: 'ASC' | 'DESC' = 'ASC';

  // 몇개의 데이터를 가져올지
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
