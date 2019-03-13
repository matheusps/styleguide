#### Filters are for filtering

### 👍 Dos

- Filter

### 👎 Don'ts

- Not filter

Filter users example

```js
class MyFilter extends React.Component {
  constructor() {
    super()
    this.state = { statements: [] }
    this.simpleInputObject = this.simpleInputObject.bind(this)
    this.cpfInputObject = this.cpfInputObject.bind(this)
    this.ageInputObject = this.ageInputObject.bind(this)
    this.ageInputRangeObject = this.ageInputRangeObject.bind(this)
    this.classSelectorObject = this.classSelectorObject.bind(this)
    this.cpfValidationRegex = RegExp(
      '([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})'
    )
  }

  simpleInputObject({
    statements,
    values,
    statementIndex,
    error,
    extraParams,
    onChangeObjectCallback,
  }) {
    return (
      <Input
        value={values || ''}
        onChange={e => onChangeObjectCallback(e.target.value)}
      />
    )
  }

  cpfInputObject(
    { statements, values, statementIndex, error, onChangeObjectCallback },
    shouldValidate = false
  ) {
    const errorMessage =
      shouldValidate && values
        ? this.cpfValidationRegex.test(values)
          ? null
          : 'Invalid CPF'
        : null
    return (
      <Input
        placeholder="Insert cpf…"
        type="number"
        errorMessage={errorMessage}
        min={0}
        value={values || ''}
        onChange={e => {
          onChangeObjectCallback(e.target.value.replace(/\D/g, ''))
        }}
      />
    )
  }

  ageInputObject({
    statements,
    values,
    statementIndex,
    error,
    onChangeObjectCallback,
  }) {
    return (
      <Input
        placeholder="Insert age…"
        type="number"
        min="0"
        max="180"
        value={values || ''}
        onChange={e => {
          onChangeObjectCallback(e.target.value.replace(/\D/g, ''))
        }}
      />
    )
  }

  ageInputRangeObject({
    statements,
    values,
    statementIndex,
    error,
    extraParams,
    onChangeObjectCallback,
  }) {
    return (
      <div className="flex">
        <Input
          placeholder="Age from…"
          errorMessage={
            statements[statementIndex].object &&
            parseInt(statements[statementIndex].object.first) >=
              parseInt(statements[statementIndex].object.last)
              ? 'Must be smaller than other input'
              : ''
          }
          value={values && values.first ? values.first : ''}
          onChange={e => {
            const currentObject = values || {}
            currentObject.first = e.target.value.replace(/\D/g, '')

            onChangeObjectCallback(currentObject)
          }}
        />

        <div className="mv4 mh3 c-muted-2 b">and</div>

        <Input
          placeholder="Age to…"
          value={values && values.last ? values.last : ''}
          onChange={e => {
            const currentObject = values || {}
            currentObject.last = e.target.value.replace(/\D/g, '')

            onChangeObjectCallback(currentObject)
          }}
        />
      </div>
    )
  }

  classSelectorObject({
    statements,
    values,
    statementIndex,
    error,
    extraParams,
    onChangeObjectCallback,
  }) {
    const isFirstSelect = !values
    const initialValue = {
      vip: true,
      gold: true,
      silver: true,
      platinum: true,
    }
    const toggleValueByKey = key => {
      return isFirstSelect
        ? {
            ...initialValue,
            [key]: false,
          }
        : {
            ...values,
            [key]: !values[key],
          }
    }
    return (
      <div>
        {Object.keys(initialValue).map(opt => {
          return (
            <div className="mb3">
              <Checkbox
                checked={isFirstSelect ? true : values[opt]}
                label={opt}
                name="default-checkbox-group"
                onChange={() => onChangeObjectCallback(toggleValueByKey(`${opt}`))}
                value={opt}
              />
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <EXPERIMENTAL_Filter
        alwaysVisibleFilters={['name', 'email', 'class']}
        statements={this.state.statements}
        onChangeStatements={statements => this.setState({ statements })}
        clearAllFiltersButtonLabel="Clear All"
        options={{
          name: {
            label: 'Name',
            renderFilterLabel: st => {
              if (!st || !st.object) {
                // you should treat empty object cases only for alwaysVisibleFilters
                return 'Any'
              }
              return `${
                st.verb === '='
                  ? 'is'
                  : st.verb === '!='
                  ? 'is not'
                  : 'contains'
              } ${st.object}`
            },
            verbs: [
              {
                label: 'is',
                value: '=',
                object: {
                  renderFn: this.simpleInputObject,
                  extraParams: {},
                },
              },
              {
                label: 'is not',
                value: '!=',
                object: {
                  renderFn: this.simpleInputObject,
                  extraParams: {},
                },
              },
              {
                label: 'contains',
                value: 'contains',
                object: {
                  renderFn: this.simpleInputObject,
                  extraParams: {},
                },
              },
            ],
          },
          email: {
            label: 'Email',
            renderFilterLabel: st => {
              if (!st || !st.object) {
                // you should treat empty object cases only for alwaysVisibleFilters
                return 'Any'
              }
              return `${
                st.verb === '='
                  ? 'is'
                  : st.verb === '!='
                  ? 'is not'
                  : 'contains '
              } ${st.object}`
            },
            verbs: [
              {
                label: 'contains',
                value: 'contains',
                object: {
                  renderFn: this.simpleInputObject,
                  extraParams: {},
                },
              },
              {
                label: 'is',
                value: '=',
                object: {
                  renderFn: this.simpleInputObject,
                  extraParams: {},
                },
              },
              {
                label: 'is not',
                value: '!=',
                object: {
                  renderFn: this.simpleInputObject,
                  extraParams: {},
                },
              },
            ],
          },
          class: {
            label: 'Class',
            renderFilterLabel: st => {
              if (!st || !st.object) {
                // you should treat empty object cases only for alwaysVisibleFilters
                return 'All'
              }
              const keys = st.object ? Object.keys(st.object) : {}
              const isAllTrue = !keys.some(key => !st.object[key])
              const isAllFalse = !keys.some(key => st.object[key])
              const trueKeys = keys.filter(key => st.object[key])
              let trueKeysLabel = ''
              trueKeys.forEach((key, index) => {
                trueKeysLabel += `${key}${
                  index === trueKeys.length - 1 ? '' : ', '
                }`
              })
              return `${
                isAllTrue ? 'All' : isAllFalse ? 'None' : `${trueKeysLabel}`
              }`
            },
            verbs: [
              {
                label: 'includes',
                value: 'includes',
                object: {
                  renderFn: this.classSelectorObject,
                  extraParams: {},
                },
              },
            ],
          },
          age: {
            label: 'Age',
            renderFilterLabel: st =>
              `${
                st.verb === 'between'
                  ? `between ${st.object.first} and ${st.object.last}`
                  : `is ${st.object}`
              }`,
            verbs: [
              {
                label: 'is',
                value: '=',
                object: {
                  renderFn: this.ageInputObject,
                  extraParams: {},
                },
              },
              {
                label: 'is between',
                value: 'between',
                object: {
                  renderFn: this.ageInputRangeObject,
                  extraParams: {},
                },
              },
            ],
          },
          cpf: {
            label: 'Document',
            renderFilterLabel: st =>
              `${st.verb === '=' ? 'is' : 'contains'} ${st.object}`,
            verbs: [
              {
                label: 'is',
                value: '=',
                object: {
                  renderFn: obj => this.cpfInputObject(obj, true),
                  extraParams: {},
                },
              },
              {
                label: 'contains',
                value: 'contains',
                object: {
                  renderFn: this.cpfInputObject,
                  extraParams: {},
                },
              },
            ],
          },
        }}
      />
    )
  }
}
;<MyFilter />
```

Filter orders with initial values

```js
const isToday = dateIsoString => dateIsoString.includes(`${
  new Date(dateIsoString).getFullYear()
}-${
  ('0' + (new Date(dateIsoString).getMonth() + 1)).slice(-2)
}-${
  ('0' + new Date(dateIsoString).getDate()).slice(-2)
}`)

class MyFilter extends React.Component {
  constructor() {
    super()
    this.state = {
      statements: [{
        subject: 'date',
        verb: '=',
        object: new Date().toISOString()
      }]
    }
    this.simpleInputObject = this.simpleInputObject.bind(this)
  }

  simpleInputObject({
    statements,
    values,
    statementIndex,
    error,
    extraParams,
    onChangeObjectCallback,
  }) {
    return (
      <Input
        value={values || ''}
        onChange={e => onChangeObjectCallback(e.target.value)}
      />
    )
  }

  statusSelectorObject({
    statements,
    values,
    statementIndex,
    error,
    extraParams,
    onChangeObjectCallback,
  }) {
    const isFirstSelect = !values
    const initialValue = {
      'payment-pending': true,
      'canceling': true,
      'canceled': true,
      'cancellation-requested': true,
      'invoiced': true,
      'processing': true,
      'created': true,
      'payment-approved': true,
      'ready-for-handling': true,
      'window-to-cancellation': true,
    }
    const toggleValueByKey = key => {
      return isFirstSelect
        ? {
            ...initialValue,
            [key]: false,
          }
        : {
            ...values,
            [key]: !values[key],
          }
    }
    return (
      <div>
        {Object.keys(initialValue).map(opt => {
          return (
            <div className="mb3">
              <Checkbox
                checked={isFirstSelect ? true : values[opt]}
                label={opt.split('-').join(' ')}
                name="default-checkbox-group"
                onChange={() => onChangeObjectCallback(toggleValueByKey(`${opt}`))}
                value={opt}
              />
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <EXPERIMENTAL_Filter
        alwaysVisibleFilters={['date', 'status']}
        statements={this.state.statements}
        onChangeStatements={statements => this.setState({ statements })}
        clearAllFiltersButtonLabel="Clear All"
        options={{
          date: {
            label: 'Date',
            renderFilterLabel: st => {
              if (!st || !st.object) {
                // you should treat empty object cases only for alwaysVisibleFilters
                return 'All'
              } else if (st.object && isToday(st.object)) {
                return 'Today'
              } else {
                return st.object
              }
            },
            verbs: [
              {
                label: 'is',
                value: '=',
                object: {
                  renderFn: this.simpleInputObject,
                  extraParams: {},
                },
              },
            ],
          },
          status: {
            label: 'Status',
            renderFilterLabel: st => st ? st.object ? (() => {
              const keys = Object.keys(st.object)
              let label = ''
              keys.forEach((key, i) => {
                label += `${key.split('-').join('  ')}${i === 0 ? '' : ', '}`
              })
              return label
            }) : '…' : 'All',
            // ^ you should treat empty object cases only for alwaysVisibleFilters
            verbs: [
              {
                label: 'is',
                value: '=',
                object: {
                  renderFn: this.statusSelectorObject,
                  extraParams: {},
                },
              },
            ],
          },
          id: {
            label: 'Order ID',
            renderFilterLabel: st =>
              `${st.verb === '=' ? 'is' : 'contains'} ${st.object}`,
            verbs: [
              {
                label: 'is',
                value: '=',
                object: {
                  renderFn: this.simpleInputObject,
                  extraParams: {},
                },
              },
              {
                label: 'contains',
                value: 'contains',
                object: {
                  renderFn: this.simpleInputObject,
                  extraParams: {},
                },
              },
            ],
          },
        }}
      />
    )
  }
}
;<MyFilter />
```