import { Plugin, HandlerDecorationMethod } from '@hapi/hapi';
import { dependencies, logger, pkg } from './config';
import { HapiPostgraphile, Postgraphile, PostgraphileIntance } from 'types';
import { instancePostgraphile } from '@redware/postgraphile-orm';
import { GraphqlModel } from '@redware/postgraphile-orm/types';
import { toInt } from './helpers';
export const plugin: Plugin<HapiPostgraphile> = {
  pkg,
  dependencies,
  register: async (server, options) => {
    /**
     * Initialize instances
     */
    const instances: PostgraphileIntance = {};
    const models: Record<string, GraphqlModel> = {};
    const setFragment = (
      key: string,
      name: string,
      fragment: {
        query: string;
        variables: any;
      }
    ) => {
      if (models[key]) {
        models[key].$addFragment(name, fragment);
      } else {
        logger.warn('The model %s dont exist', key);
      }
      // const model =
    };
    server.app.postgraphile = {
      instances,
      models,
      setFragment
    };
    /**
     * Insert instances
     */
    for (const key in options.instances) {
      const intanceOptions = options.instances[key];
      instances[key] = instancePostgraphile(
        intanceOptions.endpoint,
        intanceOptions.options
      );
    }
    /**
     *
     */
    const decorate: HandlerDecorationMethod = (
      route,
      {
        instance,
        model,
        method,
        payload: payloadHandler
      }: Postgraphile.HandlerOptions
    ) => {
      const Instance = instances[instance];
      let Model: GraphqlModel;
      const pathModel = `${instance}.${model.name}`;

      if (models[pathModel]) {
        logger.trace('Model exists: %s', pathModel);
        Model = models[pathModel];
      } else {
        logger.success('New model: %s', pathModel);
        models[pathModel] = Instance.defineModel(model.name, model.primaryKeys);
      }
      // Model.$addFragment('',{})
      switch (method) {
        case 'create':
          return async (req) => {
            return await Model.create(req.payload, {
              nameFragment: req.query.nameFragment
            });
          };
        case 'findByPk':
          return async (req) => {
            return await Model.findByPk(req.params.id, {
              nameFragment: req.query.nameFragment
            });
          };
        case 'findAll':
          return async (req) => {
            const payload: any = req.payload || {};
            const page = toInt(req.query.page, 1);
            const limit = toInt(req.query.limit, 50);
            const first = limit;
            const offset = page * limit - limit;
            return await Model.findAll(
              {
                first,
                offset,
                condition: payload.condition,
                filter: payload.filter,
                orderBy: payload.orderBy
              },
              {
                nameFragment: req.query.nameFragment,
                simpleList: !!req.query.list
              }
            );
          };
        case 'count':
          return async (req) => {
            const payload: any = req.payload || {};
            return await Model.count({
              condition: payload.condition,
              filter: payload.filter
            });
          };
        case 'updateByPk':
          return async (req) => {
            const payload: any = req.payload;
            return await Model.updateByPk(
              req.params.id,
              {
                ...payload,
                ...payloadHandler
              },
              {
                nameFragment: req.query.nameFragment
              }
            );
          };
        case 'deleteByPk':
          return async (req) => {
            return await Model.deleteByPk(req.params.id, {
              nameFragment: req.query.nameFragment
            });
          };
      }
      return async (req, h) => {
        throw new Error('No found');
      };
    };
    server.decorate('handler', 'postgraphile', decorate);
  }
};
export {
  HapiPostgraphile,
  Postgraphile,
  PostgraphileIntance,
  PostgraphileModelMethods
} from 'types';
declare module '@hapi/hapi' {
  interface ServerApplicationState {
    postgraphile: Postgraphile.AppState;
  }
  interface HandlerDecorations {
    postgraphile?: Postgraphile.HandlerOptions;
  }
}
