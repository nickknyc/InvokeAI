import { createSelector } from '@reduxjs/toolkit';
import { stateSelector } from 'app/store/store';
import { defaultSelectorOptions } from 'app/store/util/defaultMemoizeOptions';
import { colorTokenToCssVar } from 'common/util/colorTokenToCssVar';
import { isInvocationNode } from 'features/nodes/types/invocation';
import { getFieldColor } from './getEdgeColor';

export const makeEdgeSelector = (
  source: string,
  sourceHandleId: string | null | undefined,
  target: string,
  targetHandleId: string | null | undefined,
  selected?: boolean
) =>
  createSelector(
    stateSelector,
    ({ nodes }) => {
      const sourceNode = nodes.nodes.find((node) => node.id === source);
      const targetNode = nodes.nodes.find((node) => node.id === target);

      const isInvocationToInvocationEdge =
        isInvocationNode(sourceNode) && isInvocationNode(targetNode);

      const isSelected =
        sourceNode?.selected || targetNode?.selected || selected;
      const sourceType = isInvocationToInvocationEdge
        ? sourceNode?.data?.outputs[sourceHandleId || '']?.type
        : undefined;

      const stroke =
        sourceType && nodes.shouldColorEdges
          ? getFieldColor(sourceType)
          : colorTokenToCssVar('base.500');

      return {
        isSelected,
        shouldAnimate: nodes.shouldAnimateEdges && isSelected,
        stroke,
      };
    },
    defaultSelectorOptions
  );
