import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import {render} from 'react-dom'
import FilteredMultiSelect from './MultiSelect/index'

const BOOTSTRAP_CLASSES = {
  filter: 'form-control',
  select: 'form-control',
  button: 'btn btn btn-block btn-default',
  buttonActive: 'btn btn btn-block btn-primary',
}

class AddRemoveSelection extends React.Component {
  state = {
    selectedOptions: []
  }
  handleDeselect = (deselectedOptions) => {
    var selectedOptions = this.state.selectedOptions.slice()
    deselectedOptions.forEach(option => {
      selectedOptions.splice(selectedOptions.indexOf(option), 1)
    })
    this.setState({selectedOptions})
  }
  handleSelect = (selectedOptions) => {
    selectedOptions.sort((a, b) => a.id - b.id)
    this.setState({selectedOptions})
  }
  render() {
    // console.log(this.props)
    // const {state, handleDeselect, handleSelect} = this.props
    var {selectedOptions} = this.state
    // console.log(selectedOptions);
    const { options } = this.props
    return <div className="row">
      <div className="col-md-5">
        <FilteredMultiSelect
          buttonText="添加"
          classNames={BOOTSTRAP_CLASSES}
          onChange={this.handleSelect}
          options={options}
          selectedOptions={selectedOptions}
          textProp="name"
          valueProp="id"
        />
      </div>
      <div className="col-md-5">
        <FilteredMultiSelect
          buttonText="删除"
          classNames={{
            filter: 'form-control',
            select: 'form-control',
            button: 'btn btn btn-block btn-default',
            buttonActive: 'btn btn btn-block btn-danger'
          }}
          onChange={this.handleDeselect}
          options={selectedOptions}
          textProp="name"
          valueProp="id"
        />
      </div>
    </div>
  }
}
export default AddRemoveSelection
