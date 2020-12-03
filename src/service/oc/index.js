import { get, all, run, insert, exec, update, list } from '@db'


export default {
  product: {
    async list () {
      const list = await all('SELECT * FROM oc_product')
      return { list }
    },

    async create ({ label, symbol }) {
      await insert('oc_product', {
        label, symbol,
      })
    },

    async delete ({ id }) {
      await exec(`DELETE FROM oc_product WHERE id=${id}`)
    },
  },
  spec: {
    type: {
      async list ({ productId }) {
        const list = await all(`
            SELECT * FROM oc_spec_type 
            WHERE productId=${productId}
        `)
        return { list }
      },

      async create ({ productId, parentId, label, symbol }) {
        await insert('oc_spec_type', {
          productId, parentId, label, symbol,
        })
      },

      async modify ({ specId, label, symbol }) {
        await update('oc_spec_type', { label, symbol }, `WHERE id = ${specId}`)
      },

      async delete ({ id }) {
        await exec(`DELETE FROM oc_spec_type WHERE id=${id}`)
      },
    },
    value: {
      async list ({ productId }) {
        const list = await all(`
            SELECT * FROM oc_spec_value 
            WHERE productId=${productId}
        `)
        return { list }
      },

      async create ({ productId, specTypeId, parentId, label, symbol }) {
        await insert('oc_spec_value', {
          productId, specTypeId, parentId, label, symbol,
        })
      },

      async delete ({ id }) {
        await exec(`DELETE FROM oc_spec_value WHERE id=${id}`)
      },
    },
  },
}
