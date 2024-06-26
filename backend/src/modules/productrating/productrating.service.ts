import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetails } from "src/entities/orderdetails.entity";
import { ProductRating } from "src/entities/productrating.entity";
import { Products } from "src/entities/products.entity";
import { Users } from "src/entities/users.entity";
import { Repository } from "typeorm";
import { CreateMultipleProductRatingsDto, CreateProductRatingDto } from "./productrating.dto";
import { OrderDetailsProducts } from "src/entities/ordersdetailsProduct.entity";

@Injectable()
export class ProductRatingsService {
    constructor(
        @InjectRepository(ProductRating) private productRatingsRepository: Repository<ProductRating>,
        @InjectRepository(Products) private productsRepository: Repository<Products>,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        @InjectRepository(OrderDetails) private orderDetailsRepository: Repository<OrderDetails>,
        @InjectRepository(OrderDetailsProducts) private orderDetailsProductRepository: Repository<OrderDetailsProducts>
    ){}

    async createMultipleProducts(createMultipleProductRatingsDto: CreateMultipleProductRatingsDto): Promise<ProductRating[]>{
        const {userId, ratings } = createMultipleProductRatingsDto;

        const user = await this.usersRepository.findOne({ where: {id: userId}});

        if(!user) throw new BadRequestException('Invalid user ID');

        const productRatings: ProductRating[] = [];

        for(const ratingDto of ratings) {
            const { productId, rating, comment } = ratingDto;
            const product = await this.productsRepository.findOne({where: {id: productId}});
            const orderProducts = await this.orderDetailsProductRepository.findOne({where: {products: {id: productId}}})
            const orderDetails = await this.orderDetailsRepository.findOne({
                where: { order: { user: {id: userId}}},
                relations: ['order', 'order.user'],
            });

            if(!product || !orderDetails || !orderProducts) throw new BadRequestException(`User has not pruchased the prodcut with ID ${productId}`);

            const productRating = this.productRatingsRepository.create({
                rating, comment, user, product
            });

            productRatings.push(productRating);
        }

        await this.productRatingsRepository.save(productRatings);

        for(const ratingDto of ratings){
            await this.updateProductAverageRating(ratingDto.productId);
        }

        return productRatings;
    }

    private async updateProductAverageRating(productId: string): Promise<void> {
        const productRatings = await this.productRatingsRepository.find({where: { product: {id: productId}}});
        const averageRating = productRatings.reduce((sum, rating) => sum + rating.rating, 0) / productRatings.length;

        await this.productsRepository.update(productId, { averageRating});
    }

    async findAll(): Promise<ProductRating[]> {
        return this.productRatingsRepository.find({ relations: ['user', 'product']});
    }
}