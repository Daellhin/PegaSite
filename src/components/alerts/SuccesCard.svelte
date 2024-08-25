<script lang="ts">
	import { faCheckCircle } from "@fortawesome/free-regular-svg-icons"
	import Fa from "svelte-fa"
  
	let classList = ""
	export { classList as class }
  </script>
  
  <div class={"alert input-bordered border-2 border-color w-fit " + classList}>
	<Fa icon={faCheckCircle} color="green" size="lg" />
	<span>
	  <slot />
	</span>
  </div>
  