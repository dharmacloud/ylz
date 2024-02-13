<script>
import {getVip} from './vip.js'
import {vip} from './store.js'
import {_} from './textout.js'
</script>

<div class="endmarker">※<a target="_new" href={getVip('www')}>{getVip('title',$vip)}</a>※
{#if !$vip}{_("公眾版本")}※※{/if}
</div>