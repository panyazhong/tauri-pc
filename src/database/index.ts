import { DB_STORE } from "src/const/enum";

export interface Store {
  storeName: string;
  config: Config[];
}

interface Config {
  name: string;
  configInfo: any;
}

class IndexedDBClass {
  private _db: any;
  private _request: any;
  private _dbName: string;
  private _stores: Store[];
  constructor(dbName: string, stores: Store[]) {
    this._dbName = dbName;
    this._stores = stores;
  }

  connect = () => {
    return new Promise((resolve, reject) => {
      this._request = window.indexedDB.open(this._dbName, 4);

      this._request.onupgradeneeded = () => {
        this._db = this._request.result;

        this._stores.forEach(async (store) => {
          this.createStore(store);
        });
        resolve(this._db);
      };
      this._request.onsuccess = () => {
        this._db = this._request.result;

        resolve(this._db);
      };

      this._request.onerror = (error: any) => {
        reject(error);
      };
    });
  };

  // 获取事务
  getStore = async (storeName: string) => {
    if (this._db) {
      return this._db
        .transaction(storeName, "readwrite")
        .objectStore(storeName);
    }
  };

  // 创建表
  createStore = (store: Store) => {
    if (this._db) {
      const objectStore = this._db.createObjectStore(store.storeName, {
        keyPath: "id",
        autoIncrement: true,
      });

      store.config.forEach((config) => {
        objectStore.createIndex(config.name, config.name, {
          ...config.configInfo,
        });
      });
    }
  };

  // 新增 or update
  addItem = async (storeName: DB_STORE, data: any) => {
    const store = await this.getStore(storeName);

    const addRequest = store.put({ ...data });
    addRequest.onsuccess = (e: any) => {
      console.log(e);
    };
  };

  // 获取item
  getItem = async (storeName: DB_STORE, index: string, key: string) => {
    return new Promise(async (resolve, reject) => {
      const store = await this.getStore(storeName);

      const req = store.index(index).get(key);

      req.onsuccess = () => {
        resolve(req.result);
      };

      req.onerror = () => {
        reject("get data error");
      };
    });
  };

  /**
   * 获取全部数据
   * @param storeName  表明
   * @returns
   */
  getAll = async (storeName: DB_STORE) => {
    return new Promise(async (resolve, reject) => {
      const store = await this.getStore(storeName);

      const req = store.getAll();

      req.onsuccess = () => {
        resolve(req.result);
      };

      req.onerror = () => {
        reject("get data error");
      };
    });
  };

  /**
   * 删除数据
   * @param storeName 表名
   * @param key 删除 唯一熟悉
   * @returns
   */
  deleteData = async (storeName: DB_STORE, key: string) => {
    return new Promise(async (resolve, reject) => {
      const store = await this.getStore(storeName);

      const req = store.delete(key);

      req.onsuccess = () => {
        resolve("delete success");
      };

      req.onerror = (e: any) => {
        reject(e);
      };
    });
  };
}

export default IndexedDBClass;
