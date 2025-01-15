import { defineComponent, PropType, toRef, provide, onBeforeUnmount, watch } from "vue";
import { useSetupMapComponent } from "../composables/index";
import { markerSymbol } from "../shared/index";

const markerEvents = [
  "animation_changed",
  "click",
  "dblclick",
  "rightclick",
  "dragstart",
  "dragend",
  "drag",
  "mouseover",
  "mousedown",
  "mouseout",
  "mouseup",
  "draggable_changed",
  "clickable_changed",
  "contextmenu",
  "cursor_changed",
  "flat_changed",
  "rightclick",
  "zindex_changed",
  "icon_changed",
  "position_changed",
  "shape_changed",
  "title_changed",
  "visible_changed",
];

export enum Animation {
  Bounce = 1,
  Drop = 2,
}

export default defineComponent({
  name: "Marker",
  props: {
    options: {
      type: Object as PropType<google.maps.MarkerOptions>,
      required: true,
    },
    animation: {
      type: Number as PropType<Animation>,
      required: false,
    },
  },
  emits: markerEvents,
  setup(props, { emit, expose, slots }) {
    const options = toRef(props, "options");
    const animation = toRef(props, "animation");

    const marker = useSetupMapComponent("Marker", markerEvents, options, emit);

    watch(
      animation,
      (newAnimation) => {
        if (!marker.value) return;
        if (newAnimation === Animation.Drop) {
          marker.value.setAnimation(google.maps.Animation.DROP);
        } else if (newAnimation === Animation.Bounce) {
          marker.value.setAnimation(google.maps.Animation.BOUNCE);
        } else {
          marker.value.setAnimation(null);
        }
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      if (!marker.value) return;
      marker.value.setAnimation(null);
    });

    provide(markerSymbol, marker);

    expose({ marker });

    return () => {
      return slots.default?.();
    };
  },
});
