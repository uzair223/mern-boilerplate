import styled, { keyframes } from "styled-components";

const ShakeAnim = amount => keyframes`
  from {
    transform: rotate(${amount});
  }
  to {
    transform-origin:center center;
    transform: rotate(-${amount});
  }
`;

const Shake = styled.div`
  animation-name: ${props => (props.enabled ? ShakeAnim(props.amount) : "none")};
  animation-duration: ${props => props.duration};
  animation-delay: ${props => props.delay}
  animation-timing-function: ease-out;
  animation-iteration-count: ${props => props.iterations};
  animation-direction: alternate;
`;

Shake.defaultProps = {
  enabled: true,
  amount: "0.2deg",
  duration: "0.1s",
  delay: "none",
  iterations: "10",
};

export default Shake;
