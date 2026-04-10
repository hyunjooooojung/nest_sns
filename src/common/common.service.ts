import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { BaseModel } from './entity/base.entity';
import { FILTER_MAPPER } from './const/filter-mapper.const';

@Injectable()
export class CommonService {
    paginate<T extends BaseModel>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {}, 
        path: string,
    ){
        if(dto.page) {
            return this.pagePaginate(
                dto, 
                repository, 
                overrideFindOptions,
            );
        }else {
            return this.cursorPaginate(
                dto, 
                repository,
                overrideFindOptions,
                path,
            )
        }
    }

    private async pagePaginate<T extends BaseModel>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {}, 
    ){
        
    }

    private async cursorPaginate<T extends BaseModel>(
        dto: BasePaginationDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {}, 
        path: string,
    ){
      const findOptions = this.composeFindOptions(dto);  
    }

    private composeFindOptions<T extends BaseModel>(
        dto: BasePaginationDto,
    ): FindManyOptions<T> {
        /**
         * where,
         * order,
         * take,
         * skip -> page 기반일때만
         */
        /**
         * DTO의 현재 생긴 구조는 아래와 같다
         * {
         *     page: number,
         *     where__id__more_than: number,
         *     where__id__less_than: number,
         *     order__createdAt: 'ASC' | 'DESC',
         *     take: number,
         * }
         * 
         * 현재는 where__id__more_than, where__id__less_than에 해당되는 where 필터만 사용중이지만
         * 나중에 다른 where 필터(where__likeCount__more_than 등등)를 넣고 싶어졌을 때
         * 모든 where 필터들을 자동으로 파싱할 수 있어야한다.
         * 
         * 1) where로 시작한다면 필터 로직을 적용한다.
         * 2) order로 시작한다면 정렬 로직을 적용한다.
         * 3) 필터 로직을 적용한다면 '__' 기준으로 split 했을 때 3개의 값으로 나뉘는지
         *    2개의 값으로 나뉘는지 확인한다.
         *    3-1) 3개의 값으로 나뉜다면 FILTER_MAPPER에서 해당되는 operator 함수를 찾아서 적용한다. ex.['where', 'id', 'more_than']
         *    3-2) 2개의 값으로 나뉜다면 정확한 값을 필터링하는 것이니까 operator 없이 적용한다. ex. where__id (['where', 'id']) 
         * 4) order의 경우 3-2와 같이 적용한다.
        */
        let where: FindOptionsWhere<T> = {};
        let order: FindOptionsOrder<T> = {};

        for(const [key, value] of Object.entries(dto)) {
            if(key.startsWith('where__')) {
                where = {
                    ...where,
                    ...this.parseWhereFilter(key, value),
                };
            }else if(key.startsWith('order__')) {
                order = {
                    ...order,
                    ...this.parseWhereFilter(key, value),
                }
            }
        }

        return {
            where,
            order,
            take: dto.take,
            skip: dto.page ? dto.take * (dto.page! - 1) : undefined,
        };
    }

    private parseWhereFilter<T extends BaseModel>(key: string, value: any): FindOptionsWhere<T> | FindOptionsOrder<T>{
        const options: FindOptionsWhere<T> = {};
        const split = key.split('__');
        if(split.length !==2 && split.length !==3) {
            throw new BadRequestException(`Invalid where filter: ${key}`);
        }

        if(split.length === 2) {
            const [_, field] = split;
            options[field] = value;
        }else {
            /**
             * split.length가 3일 경우에는 TypeORM 유틸리티 적용이 필요한 경우다.
             * 
             * where__id__more_than -> ['where', 'id', 'more_than']
             * where는 버려도 되고 두번째 값은 필터할 키 값이 되고
             * 세번째 값은 typeorm 유틸리티가 된다.
             * 
             * FILTER_MAPPER에서 해당되는 field 값을 찾아서 해당되는 유틸리티를 가져온 후 값에 적용한다.
             */
            const [_, field, operator] = split;
            options[field] = FILTER_MAPPER[operator](value);

            // between 외의 경우에는 배열로 변환해서 적용한다.
            // const values = value.toString().split(',');
            // if(operator === 'between') {
            //     options[field] = FILTER_MAPPER[operator](values[0], values[1]);
            // } else {
            //     options[field] = FILTER_MAPPER[operator](...values);
            // }
        }
        return options;
    }
}
