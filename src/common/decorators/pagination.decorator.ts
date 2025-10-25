import { SetMetadata } from "@nestjs/common"

export const PAGINATION_KEY = "Pagination"

export const EnablePagination = () =>  SetMetadata(PAGINATION_KEY,true)