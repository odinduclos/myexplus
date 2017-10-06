<?php

namespace AppBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use AppBundle\EventListener\CorsListener;


class CorsListener
{

  public function onKernelResponse(FilterResponseEvent $event)
  {
    $response = $event->getResponse();
    $response->headers->set('Access-Control-Allow-Headers', 'origin, content-type, accept, X-Requested-With, X-Auth-Token');
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Credentials', 'true');
    $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH, OPTIONS');
    $event->setResponse($response);
  }

}