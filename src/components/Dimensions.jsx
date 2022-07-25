import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from '@emotion/styled';
import Picker from './Picker';
import * as actionCreators from '../store/actions/actionCreators';

const PickerWrapper = styled.div`
  margin-bottom: 2rem;
`;

const Dimensions = props => {
  const changeDimensions = (gridProperty, behaviour) => {
    props.actions.changeDimensions(gridProperty, behaviour);
  };

  const { columns, rows, showDimensionsUI } = props;

  if (!showDimensionsUI) {
    return null;
  }

  return (
    <div className="dimensions">
      <PickerWrapper>
        <Picker type="columns" value={columns} action={changeDimensions} />
      </PickerWrapper>
      <PickerWrapper>
        <Picker type="rows" value={rows} action={changeDimensions} />
      </PickerWrapper>
    </div>
  );
};

const mapStateToProps = state => ({
  columns: state.present.getIn(['frames', 'columns']),
  rows: state.present.getIn(['frames', 'rows']),
  showDimensionsUI: state.present.get('options').get('showDimensionsUI')
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

const DimensionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dimensions);
export default DimensionsContainer;
