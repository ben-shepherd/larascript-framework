/* eslint-disable no-undef */
import { describe, expect } from '@jest/globals';
import { IModelAttributes } from "@src/core/interfaces/IModel";
import Model from '@src/core/models/base/Model';
import testHelper from '@src/tests/testHelper';


describe('test table names for models', () => {

    class PeopleModel extends Model<IModelAttributes> {}
    class MoviesModel extends Model<IModelAttributes> {}
    class BlogPost extends Model<IModelAttributes> {}
    class CustomModel extends Model<IModelAttributes> {

        table: string = 'custom_table';
    
    }

    beforeAll(async () => {
        await testHelper.testBootApp()
    })

    test('check formatting',async () => {
        const people = new PeopleModel(null)
        expect(people.useTableName()).toBe('peoples');

        const movies = new MoviesModel(null)
        expect(movies.useTableName()).toBe('movies');

        const blogPost = new BlogPost(null)
        expect(blogPost.useTableName()).toBe('blog_posts');

        const custom = new CustomModel(null)
        expect(custom.useTableName()).toBe('custom_table');
        
    });
});