import styled, { keyframes } from "styled-components";

const spin = keyframes`
  100%{transform: rotate(1turn)}
`;
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Spinner = styled.div`
  width: ${props => (props.radius * 2).toString() + props.unit};
  height: ${props => (props.radius * 2).toString() + props.unit};
  border-radius: 50%;
  background: radial-gradient(farthest-side, ${props => props.color} 94%, #0000) top/
      ${props => ((1 - props.thicknessPercent / 100) * props.radius).toString() + props.unit}
      ${props => ((1 - props.thicknessPercent / 100) * props.radius).toString() + props.unit}
      no-repeat,
    conic-gradient(#0000 30%, ${props => props.color});
  mask: radial-gradient(farthest-side, #0000 calc(${props => props.thicknessPercent}%), #000 0);

  visibility: ${props => (props.enabled ? "visible" : "hidden")};
  animation: ${spin} 1.2s infinite cubic-bezier(0.35, 0, 0.3, 0.9),
    ${props => (props.enabled ? fadeIn : fadeOut)} ${props => props.duration} ease;
  transition: visibility ${props => props.duration} ease;

  position: fixed;
  top: -100%;
  right: -100%;
  left: -100%;
  bottom: -100%;
  margin: auto;
  z-index: 0;
`;

Spinner.defaultProps = {
  color: "skyblue",
  radius: 2.5,
  unit: "rem",
  thicknessPercent: 60,
  duration: "1s",
};

export default Spinner;
