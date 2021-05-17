/* eslint-disable @typescript-eslint/no-empty-interface */
import { Server, ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import {
  InstancePostgraphile,
  GraphqlModel
} from '@redware/postgraphile-orm/types';
import { RequestInit } from 'graphql-request/dist/types.dom';

export interface HapiPostgraphile {
  instances: Record<
    string,
    {
      endpoint: string;
      options?: RequestInit;
    }
  >;
}
export type PostgraphileIntance = Record<string, InstancePostgraphile>;
export type PostgraphileModelMethods = keyof GraphqlModel;
export namespace Postgraphile {
  export interface AppState {
    instances: PostgraphileIntance;
    models: Record<string, GraphqlModel>;
    setFragment: (
      key: string,
      name: string,
      fragment: {
        query: string;
        variables: any;
      }
    ) => void;
  }
  export interface HandlerOptions {
    instance: string;
    model: {
      name: string;
      primaryKeys: Record<string, string>;
    };
    payload?: any;
    method: PostgraphileModelMethods;
    // handler: (context: {
    //   req: Request;
    //   h: ResponseToolkit;
    //   model: GraphqlModel;
    //   payload: any;
    // }) => Promise<unknown>;
  }
}
