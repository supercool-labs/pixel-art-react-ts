import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../store/actions/actionCreators';

const Duration = ({ actions, duration, showFrameControls }) => {
  const handleChange = event => {
    actions.setDuration(event.target.value);
  };

  if (!showFrameControls) {
    return null;
  }

  return (
    <div className="duration">
      <label htmlFor="duration__input">
        Duration
        <input
          type="number"
          value={duration}
          onChange={event => {
            handleChange(event);
          }}
          id="duration__input"
        />
      </label>
    </div>
  );
};

const mapStateToProps = state => ({
  duration: state.present.get('duration'),
  showFrameControls: state.present.get('options').get('showFrameControls')
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

const DurationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Duration);
export default DurationContainer;
